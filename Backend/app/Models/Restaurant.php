<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'opening_hours',
        // 'user_id', //  til fremtidig bruger-tilknytning
    ];

    protected $casts = [
        'opening_hours' => 'array',
    ];

    // relation til User
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
