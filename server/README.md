1. Install stripe
2. stripe login
3. stripe login --project-name rocket-rides
4. Webhook stripe local 
.\stripe.exe listen --forward-to 127.0.0.1:5000/api/payments/webhook whsec_16aa8c69c742806e98fba8414cab4eb1f449291d5bf6f8b37278bb7eb501b996


.\stripe.exe listen --forward-to 127.0.0.1:5000/api/payments/webhook  --api-key sk_test_51OP4auC8xglLK7o8T89SeGrELxFEUGxKRF4OXY9shtsmpAZdkgUIhg9jmkgNZUJ3oFTZF9h1izEtP3uem01r36nu00qtXoL3Fh