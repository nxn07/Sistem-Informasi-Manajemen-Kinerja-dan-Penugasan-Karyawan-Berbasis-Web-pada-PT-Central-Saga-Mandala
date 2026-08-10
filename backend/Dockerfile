FROM php:8.4-fpm-alpine

# Install system dependencies & PostgreSQL driver
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql bcmath

# Install Composer
COPY --from=docker.io/library/composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Install dependencies laravel dengan mengabaikan pengecekan ketat platform
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
