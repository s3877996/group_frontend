import stripe
from server.config import STRIPE_KEY,FE_DOMAIN,WEBHOOK_STRIPE_KEY


class StripeService:
    def __init__(self) -> None:
        stripe.api_key = STRIPE_KEY

    def modify_customer_name(self, cus_id: str, name: str):
        return stripe.Customer.modify(
            cus_id,
            name=name
        )

    def modify_default_payment_method(self, cus_id: str, payment_method: str):
        return stripe.Customer.modify(
            cus_id,
            invoice_settings={'default_payment_method': payment_method}
        )


    def create_stripe_link(self, price_id: str, model: str, cus_id: str = None, metadata: any = None):
        success_url = FE_DOMAIN + 'success'
        print(price_id,cus_id,success_url)
        return stripe.checkout.Session.create(
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            customer=cus_id,
            mode=model,
            metadata=metadata,
            allow_promotion_codes=True,
            invoice_creation={"enabled": True} if model == 'payment' else None,
            success_url=success_url
        )

    def get_event_webhook(self, data, stripe_signature):
        webhook_secret = WEBHOOK_STRIPE_KEY
        return stripe.Webhook.construct_event(
            payload=data,
            sig_header=stripe_signature,
            secret=webhook_secret
        )

    def get_session(self, id):
        session = stripe.checkout.Session.retrieve(
            id,
            expand=['line_items'],
        )
        return session['id']

    def get_sessions(self, cus_stripe_id: str, starting_after=None, limit=10):
        args = {"customer": cus_stripe_id, "limit": limit}
        if starting_after:
            args['starting_after'] = starting_after
        try:
            sessions = stripe.checkout.Session.list(
                **args
            )

            return sessions
        except stripe.error.InvalidRequestError as e:
            return {
                "object": "list",
                "data": [],
                "has_more": False,
                "url": "/v1/checkout/sessions"
            }

    def list_payment_methods(self, cus_stripe_id: str):
        if not cus_stripe_id:
            return {
                'total': 0,
                'results': []
            }
        raw = stripe.Customer.list_payment_methods(
            cus_stripe_id,
            include=["total_count"],
            type="card",
            limit=100
        )
        raw['total'] = raw.pop('total_count')
        raw['results'] = raw.pop('data')
        return raw

    def get_default_payment_methods(self, cus_stripe_id: str):
        if not cus_stripe_id:
            return {'defaultPaymentMethod': None}

        # get current user
        customer = stripe.Customer.retrieve(cus_stripe_id)

        default_source = customer.invoice_settings.default_payment_method

        if not default_source:
            default_source = customer.default_source

        return {'defaultPaymentMethod': default_source}

    def retrieve_invoice(self, ins_id):
        return stripe.Invoice.retrieve(ins_id)

    def create_cus(self, email, fullname):
        cus = stripe.Customer.create(
            email=email,
            name=fullname
        )
        return cus['id']

    def create_balance_transaction(self, cus: str, amount: float, currency: str, description: str, metadata={}):
        return stripe.Customer.create_balance_transaction(
            cus,
            amount=amount,
            description=description,
            metadata=metadata,
            currency=currency
        )


stripe_service = StripeService()
