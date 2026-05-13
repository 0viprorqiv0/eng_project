<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 20);
            $table->date('date_of_birth')->nullable();
            $table->string('position'); // Vị trí ứng tuyển
            $table->string('experience')->nullable(); // Kinh nghiệm: e.g. "1 năm", "3 năm"
            $table->text('achievements')->nullable(); // Thành tích
            $table->string('cv_link')->nullable(); // Link CV hoặc Portfolio
            $table->text('cover_letter')->nullable(); // Thư giới thiệu ngắn
            $table->enum('status', ['new', 'reviewing', 'interview', 'accepted', 'rejected'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
