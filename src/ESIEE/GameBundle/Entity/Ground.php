<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ground
 *
 * @ORM\Table(name="esiee_game_ground")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\GroundRepository")
 */
class Ground
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var integer
     *
     * @ORM\Column(name="protection", type="integer")
     */
    private $protection;


    public function __toString()
    {
        return $this->name;
    }


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Ground
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param int $protection
     */
    public function setProtection($protection)
    {
        $this->protection = $protection;
    }

    /**
     * @return int
     */
    public function getProtection()
    {
        return $this->protection;
    }
}
