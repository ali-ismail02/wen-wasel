<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fare;

class FareSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Fare::create([
            'fare' => 20000,
            "name" => "van"
        ]);

        Fare::create([
            'fare' => 50000,
            "name" => "service"
        ]);
    }
}
