<?php

namespace App\Jobs;

use App\Mail\CadeauMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class EnvoieEmailCadeau implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $commande;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($commande)
    {
        $this->commande = $commande;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to($this->commande->email_cadeau)->send(new CadeauMail($this->commande));
    }
}
