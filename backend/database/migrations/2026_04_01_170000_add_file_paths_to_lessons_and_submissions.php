<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('video_path')->nullable()->after('video_url');
            $table->string('materials_path')->nullable()->after('video_path');
            $table->enum('video_type', ['upload', 'url'])->default('upload')->after('materials_path');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('file_url');
            $table->string('file_name')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['video_path', 'materials_path', 'video_type']);
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_name']);
        });
    }
};
