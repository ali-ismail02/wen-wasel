<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteTypes extends Model
{
    use HasFactory;

    public $fillable = [
        'type',
    ];

    public function routes()
    {
        return $this->hasMany(Route::class);
    }
}
