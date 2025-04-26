#!/bin/bash

# Run migrations
echo "Running migrations..."
python manage.py migrate
python manage.py collectstatic --noinput
# Check if superuser already exists
# SUPERUSER_EXISTS=$(python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.filter(username='admin').exists())")

# if [ "$SUPERUSER_EXISTS" == "False" ]; then
#   # Create superuser (skip interactive prompt by specifying details directly)
#   echo "Creating superuser..."
#   python manage.py shell << EOF
# from django.contrib.auth.models import User;
# User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
# EOF
# else
#   echo "Superuser already exists, skipping creation."
# fi

# Start Daphne server (or you can change to another server like Gunicorn)
echo "Starting the application..."
daphne -b 0.0.0.0 -p 8000 config.asgi:application
