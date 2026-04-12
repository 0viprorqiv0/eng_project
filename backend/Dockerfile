FROM php:8.2-fpm

# Cài đặt system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# Xóa cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Cấu hình PHP cho upload lớn
RUN echo "upload_max_filesize=200M" > /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size=200M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/uploads.ini

# Lấy Composer mới nhất
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Copy toàn bộ code vào container
COPY . .

# Cài đặt dependencies với Composer
RUN composer install --no-dev --optimize-autoloader

# Phân quyền cho Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Cấu hình Nginx
COPY ./nginx.conf /etc/nginx/sites-available/default

# Expose port cổng 80 (hoặc port của Render)
EXPOSE 80

# Chạy migrate và khởi động Nginx + PHP-FPM
CMD php artisan migrate --force && php artisan storage:link && php-fpm -D && nginx -g 'daemon off;'
