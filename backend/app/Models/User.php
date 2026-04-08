<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'role',
        'email',
        'password',
        'phone',
        'dob',
        'bio',
        'avatar_url',
        'qualifications',
        'streak',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dob' => 'date',
            'qualifications' => 'array',
        ];
    }

    /* ---- Relationships ---- */

    public function enrollments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Enrollment::class);
    }

    public function courses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Course::class, 'enrollments')
            ->withPivot('progress', 'completed_lessons', 'status')
            ->withTimestamps();
    }

    public function taughtCourses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Course::class, 'teacher_id');
    }

    /* ---- Role helpers ---- */

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function setting(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\UserSetting::class);
    }
}
