<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_time',
        'end_time',
        'start_location',
        'end_location',
    ];

    public function tripRecords(){
        return $this->hasMany(TripRecord::class);
    }

    public function subTrips(){
        return $this->hasMany(SubTrip::class);
    }
}
