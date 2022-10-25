<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'make',
        'model',
        'year',
        'license_plate',
        'license',
        'front_image',
        'side_image',
        'seats',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function presavedRoutes(){
        return $this->hasMany(PresavedRoute::class);
    }
    
    public function routes(){
        return $this->hasMany(Route::class);
    }

    public function tripRecords(){
        return $this->hasMany(TripRecord::class);
    }
}
