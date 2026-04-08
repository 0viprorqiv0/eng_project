<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->enum('lesson_type', ['video', 'document', 'quiz', 'assignment'])->default('video')->after('title');
            $table->text('description')->nullable()->after('content');
            $table->boolean('is_free_preview')->default(false)->after('duration_minutes');
            $table->enum('unlock_condition', ['immediate', 'after_previous', 'after_days'])->default('immediate')->after('is_free_preview');
            $table->integer('unlock_days')->default(0)->after('unlock_condition');
            $table->string('subtitle_path')->nullable()->after('materials_path');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn([
                'lesson_type', 'description', 'is_free_preview',
                'unlock_condition', 'unlock_days', 'subtitle_path'
            ]);
        });
    }
};
