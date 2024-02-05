<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231114080306 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE publication ADD topic TEXT NOT NULL');
        $this->addSql('ALTER TABLE publication ADD writing_technique TEXT NOT NULL');
        $this->addSql('ALTER TABLE publication DROP content');
        $this->addSql('ALTER TABLE publication DROP open_ai_context');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE publication ADD content TEXT NOT NULL');
        $this->addSql('ALTER TABLE publication ADD open_ai_context TEXT NOT NULL');
        $this->addSql('ALTER TABLE publication DROP topic');
        $this->addSql('ALTER TABLE publication DROP writing_technique');
    }
}
