<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TileFamily
 *
 * @ORM\Table(name="esiee_game_tile_family")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\TileFamilyRepository")
 */
class TileFamily
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
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\Ground")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;


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
     * @return TileFamily
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
     * Set ground
     *
     * @param \ESIEE\GameBundle\Entity\Ground $ground
     * @return TileFamily
     */
    public function setGround(\ESIEE\GameBundle\Entity\Ground $ground = null)
    {
        $this->ground = $ground;

        return $this;
    }

    /**
     * Get ground
     *
     * @return \ESIEE\GameBundle\Entity\Ground 
     */
    public function getGround()
    {
        return $this->ground;
    }
}
