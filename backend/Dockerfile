FROM php:8.4-fpm-alpine

# Install system dependencies & PostgreSQL driver + build tools untuk PECL
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions & Redis
RUN docker-php-ext-install pdo pdo_pgsql pgsql bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
COPY --from=docker.io/library/composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Install dependencies laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

# Buat symlink storage ke public agar file upload tidak 404
RUN php artisan storage:link

ENV PHP_CLI_SERVER_WORKERS=4

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000