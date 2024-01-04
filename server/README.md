1. Install stripe
2. stripe login
3. stripe login --project-name rocket-rides
4. Webhook stripe local 
stripe listen --forward-to 127.0.0.1:5000/api/payments/webhook
