<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'opening_hours'
    ];

    protected $casts = [
        'opening_hours' => 'array',
    ];
}
