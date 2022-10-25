<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresavedRoute extends Model
{
    use HasFactory;

    public $fillable = [
        'driver_id',
        'name',
        'start_time',
    ];

    public function driver(){
        return $this->belongsTo(Driver::class);
    }

    public function routes(){
        return $this->hasMany(Route::class);
    }
}
