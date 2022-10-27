<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TripType;

class TripTypeSeeder extends Seeder
{
    public function run(){
        Triptype::create([
            'type' => 'Service',
        ]);

        Triptype::create([
            'type' => 'Van',
        ]);

        Triptype::create([
            'type' => 'Walk',
        ]);
    }
}
