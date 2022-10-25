<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; 

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;
    use Notifiable;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'image',
        'user_type',
    ];

    protected $hidden = [
        'password',
    ];

    public function userTypes(){
        return $this->belongsTo(User_type::class);
    }

    public function drivers(){
        return $this->hasMany(Driver::class);
    }

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }

    public function trips(){
        return $this->hasMany(Trip::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
