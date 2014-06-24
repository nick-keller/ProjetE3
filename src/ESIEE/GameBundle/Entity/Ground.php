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

    /**
     * @ORM\OneToMany(targetEntity="TileFamily", mappedBy="ground")
     */
    private $tileFamilies;

    /**
     * @ORM\OneToMany(targetEntity="UnitSpeed", mappedBy="unitType", cascade={"persist"})
     */
    private $speeds;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tileFamilies = new \Doctrine\Common\Collections\ArrayCollection();
        $this->speeds = new \Doctrine\Common\Collections\ArrayCollection();
    }


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

    /**
     * Add tileFamilies
     *
     * @param \ESIEE\GameBundle\Entity\TileFamily $tileFamilies
     * @return Ground
     */
    public function addTileFamily(\ESIEE\GameBundle\Entity\TileFamily $tileFamilies)
    {
        $this->tileFamilies[] = $tileFamilies;

        return $this;
    }

    /**
     * Remove tileFamilies
     *
     * @param \ESIEE\GameBundle\Entity\TileFamily $tileFamilies
     */
    public function removeTileFamily(\ESIEE\GameBundle\Entity\TileFamily $tileFamilies)
    {
        $this->tileFamilies->removeElement($tileFamilies);
    }

    /**
     * Get tileFamilies
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTileFamilies()
    {
        return $this->tileFamilies;
    }

    /**
     * Add speeds
     *
     * @param \ESIEE\GameBundle\Entity\UnitSpeed $speeds
     * @return UnitType
     */
    public function addSpeed(\ESIEE\GameBundle\Entity\UnitSpeed $speeds)
    {
        $this->speeds[] = $speeds;

        return $this;
    }

    /**
     * Remove speeds
     *
     * @param \ESIEE\GameBundle\Entity\UnitSpeed $speeds
     */
    public function removeSpeed(\ESIEE\GameBundle\Entity\UnitSpeed $speeds)
    {
        $this->speeds->removeElement($speeds);
    }

    /**
     * Get speeds
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSpeeds()
    {
        return $this->speeds;
    }
}
