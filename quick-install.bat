copy app/config/parameters.yml.dist app/config/parameters.yml
composer install
php app/console doctrine:schema:update --force
php app/console fos:user:create admin admin@gmail.com admin --super-admin
php app/console cache:clear