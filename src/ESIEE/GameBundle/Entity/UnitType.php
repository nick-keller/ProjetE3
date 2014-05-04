<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UnitType
 *
 * @ORM\Table(name="esiee_game_unit_type")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\UnitTypeRepository")
 */
class UnitType
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
     * @ORM\OneToMany(targetEntity="UnitSpeed", mappedBy="unitType", cascade={"persist", "remove"})
     */
    private $speeds;


    /**
     * Constructor
     */
    public function __construct()
    {
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
     * @return UnitType
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
