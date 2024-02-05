<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use App\Entity\User;
use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:create-profile',
    description: 'Add a short description for your command',
)]
class CreateProfileCommand extends Command
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Creates a new profile.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $user = $this->entityManager->getRepository(User::class)->find(1);
        if (!$user) {
            $output->writeln('No user found for id 1');
            return Command::FAILURE;
        }

        $profile = new Profile();
        $profile->setFirstName('Jamal');
        $profile->setLastName('Elkhalil');
        $profile->setUserId($user);
        $profile->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        $output->writeln('profile created!');

        return Command::SUCCESS;
    }
}