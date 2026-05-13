<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfNotBanned
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            if ($user->banned_until && now()->lt($user->banned_until)) {
                
                // If they are banned, revoke their tokens to force logout
                $user->tokens()->delete();

                return response()->json([
                    'error' => 'Tài khoản của bạn đã bị khóa đến ' . $user->banned_until->format('d/m/Y H:i'),
                ], 403);
            }
        }
        
        return $next($request);
    }
}
