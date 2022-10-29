<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminAccsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin1',
            'email' => 'admin1@email.com',
            'password' => bcrypt('password123'),
            'user_type' => 1,
            'image' => null,
            'phone' => 1234567890,
        ]);

        User::create([
            'name' => 'Admin2',
            'email' => 'admin2@email.com',
            'password' => bcrypt('password123'),
            'user_type' => 1,
            'image' => null,
            'phone' => 1234567890
        ]);

        User::create([
            'name' => 'Admin3',
            'email' => 'admin3@email.com',
            'password' => bcrypt('password123'),
            'user_type' => 1,
            'image' => null,
            'phone' => 1234567890
        ]);
    }
}
