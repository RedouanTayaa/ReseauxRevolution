<?php

namespace App\Command;

use App\Entity\Plan;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreatePlanCommand extends Command
{
    protected static $defaultName = 'app:create-plan';

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Creates a new plan.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
//        $plan = new Plan();
//        $plan->setName('Plan Basic');
//        $plan->setSlug('plan-basic');
//        $plan->setStripeId('price_1OJUVsCvOXSMgA7QyNBWHX41'); // Remplacez 'stripe-id' par l'ID du plan dans Stripe
//        $plan->setPrice(1000); // 10.00 EUR

        $plan2 = new Plan();
        $plan2->setName('Plan Premium');
        $plan2->setSlug('plan-premium');
        $plan2->setStripeId('price_1OJUVsCvOXSMgA7QyNBWHX41'); // Remplacez 'stripe-id' par l'ID du plan dans Stripe
        $plan2->setPrice(2000); // 20.00 EUR

//        $plan3 = new Plan();
//        $plan3->setName('Plan Pro');
//        $plan3->setSlug('plan-pro');
//        $plan3->setStripeId('price_1OGig5CvOXSMgA7QDYdLWLuR'); // Remplacez 'stripe-id' par l'ID du plan dans Stripe
//        $plan3->setPrice(3000); // 30.00 EUR


        $this->entityManager->persist($plan2);
        $this->entityManager->flush();

        $output->writeln('Plan created!');

        return Command::SUCCESS;
    }
}