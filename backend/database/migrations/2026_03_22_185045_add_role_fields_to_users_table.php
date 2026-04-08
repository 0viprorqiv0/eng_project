<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'teacher', 'student'])->default('student')->after('name');
            $table->string('phone', 20)->nullable()->after('email');
            $table->date('dob')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('dob');
            $table->string('avatar_url')->nullable()->after('bio');
            $table->integer('streak')->default(0)->after('avatar_url');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'dob', 'bio', 'avatar_url', 'streak']);
        });
    }
};
