<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CommandeConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($commande)
    {
        $this->commande = $commande;    
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        
        return $this->markdown('emails.commande.confirmation')
                    ->subject('Confirmation de votre commande')
                    // ->from('wonderful@company.com', 'Wonderful Company')
                    ->with(['commande' => $this->commande]);
    }
}
