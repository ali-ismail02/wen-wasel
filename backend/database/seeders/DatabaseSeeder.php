<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RouteTypeSeeder::class,
            UserTypeSeeder::class,
            TripTypeSeeder::class,
            AdminAccsSeeder::class,
            FareSeeder::class,
        ]);
    }
}
