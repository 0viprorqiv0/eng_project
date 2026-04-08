<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();                    // "grammar", "advanced"
            $table->string('title');                              // "KHÓA 1: TỔNG ÔN NGỮ PHÁP..."
            $table->string('subtitle')->nullable();              // "Xây gốc - Nắm chắc 7+"
            $table->text('description')->nullable();             // Mô tả dài
            $table->text('outcome')->nullable();                 // Đầu ra kỳ vọng
            $table->string('price')->nullable();                 // "1.990.000đ"
            $table->integer('price_amount')->default(0);         // 1990000 (for sorting/calc)
            $table->string('category')->nullable();              // "Lớp 12", "IELTS", "Giao tiếp"
            $table->string('level')->nullable();                 // "Mục tiêu 7+", "Advanced"
            $table->string('duration')->nullable();              // "24 buổi"
            $table->string('image')->nullable();                 // URL/path ảnh bìa
            $table->string('color', 20)->default('navy');        // "navy", "beered"
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('rating', 3, 1)->default(0);
            $table->timestamps();
        });

        Schema::create('course_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->integer('progress')->default(0);             // 0-100
            $table->integer('completed_lessons')->default(0);
            $table->enum('status', ['active', 'completed', 'paused'])->default('active');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('course_structures');
        Schema::dropIfExists('courses');
    }
};
