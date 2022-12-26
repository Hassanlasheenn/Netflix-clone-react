import { collection, getDocs, where, query, addDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import './Plans.css';
import { loadStripe } from '@stripe/stripe-js';

const Plans = () => {

    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    
    useEffect(() => {
        if(collection) {
            getDocs(query(collection(db, 'products'), where('active', "==", true)))
            .then((querySnapshot) => {
                const products = {}
                querySnapshot.forEach(async (productDoc) => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await getDocs(query(collection(db, `products/${productDoc.id}/prices`)));
                    priceSnap.docs.forEach((price) => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            ...price.data(),
                        };
                    });
                    setProducts(products);
                });
                return querySnapshot;
            });
        }
    }, []);

    
    const loadCheckout = async (priceId) => {
        const firstQ = collection(db, `customers/${user.uid}/checkout_sessions`);
        const secondQ = await addDoc(firstQ, {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            })
            
        onSnapshot(secondQ, async (snap) => {
            const { error, sessionId } = snap.data();
            if(error) {
                // show error to the customer
                // inspect the cloud function logs in the firebase console.
                alert(`An error occured: ${error.message}`);
            }
            if (sessionId) {
                // we have a stripe checkout url, let's redirect
                const stripe = await loadStripe(
                    'pk_test_51LnQj5K41BCUjAV1QSW7AAeX3XMzWJZLUNPNPKPKtHojs4wj9ECSky68tcluQQkCGMsgrA6wMQ58C0uYEWdUALja00CNIYgnnb');
                stripe.redirectToCheckout({ sessionId });
            }
        });
    }

  return (
    <div className='plans'>
      {Object.entries(products).map(([productId, productData], index) => {
        // add some logic to check if the user's subscription is active...
        return (
            <div key={index} className='plans__plan'>
                <div className='plans__info'>
                    <h5>{productData.name}</h5>
                    <h6>{productData.description}</h6>
                </div>
                <button onClick={() => loadCheckout(productData.prices.priceId)}>
                    Subscribe
                </button>
            </div>
        );
      })}
    </div>
  )
}

export default Plans;
