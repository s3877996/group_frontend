import re

def validate(data, regex):
    """Custom Validator"""
    return bool(re.match(regex, data))

def validate_password(password: str):
    """Password Validator"""
    reg = r"\b^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$\b"
    return validate(password, reg)

def validate_email(email: str):
    """Email Validator"""
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return validate(email, regex)

def validate_user(**args):
    """User Validator"""
    errors = {}

    if not args.get('user_email') or not args.get('user_password') or not args.get('username'):
        errors['user_email'] = 'Email is required'
        errors['user_password'] = 'Password is required'
        errors['username'] = 'Name is required'

    if not all(isinstance(args[key], str) for key in ['username', 'user_email', 'user_password']):
        errors['user_email'] = 'Email must be a string'
        errors['user_password'] = 'Password must be a string'
        errors['username'] = 'Name must be a string'

    if not validate_email(args.get('user_email')):
        errors['user_email'] = 'Email is invalid'

    if not validate_password(args.get('user_password')):
        errors['user_password'] = 'Password is invalid. It should be at least 8 characters with upper and lower case letters, numbers, and special characters'

    name_word_count = len(args['username'].split())
    if not 2 <= name_word_count <= 30:
        errors['username'] = 'Name must be between 2 and 30 words'

    return errors if errors else True


def validate_email_and_password(email, password):
    """Email and Password Validator"""
    errors = {}

    if not (email and password):
        errors['email'] = 'Email is required'
        errors['password'] = 'Password is required'

    if not validate_email(email):
        errors['email'] = 'Email is invalid'

    if not validate_password(password):
        errors['password'] = 'Password is invalid. It should be at least 8 characters with upper and lower case ' \
                             'letters, numbers, and special characters '

    return errors if errors else True