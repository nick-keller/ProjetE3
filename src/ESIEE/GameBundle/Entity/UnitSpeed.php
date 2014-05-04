<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * UnitSpeed
 *
 * @ORM\Table(name="esiee_game_unit_speed")
 * @ORM\Entity
 */
class UnitSpeed
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
     * @var UnitType
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\UnitType", inversedBy="speeds", cascade={"persist"})
     * @ORM\JoinColumn(name="unit_type_id", referencedColumnName="id")
     */
    private $unitType;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\Ground", cascade={"persist"})
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var float
     *
     * @ORM\Column(name="cost", type="integer")
     */
    private $cost;

    public function __toString()
    {
        return $this->ground->getName() . ' : ' . $this->cost;
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
     * Set speed
     *
     * @param string $speed
     * @return UnitSpeed
     */
    public function setCost($speed)
    {
        $this->cost = $speed;

        return $this;
    }

    /**
     * Get speed
     *
     * @return string 
     */
    public function getCost()
    {
        return $this->cost;
    }

    /**
     * Set unitType
     *
     * @param \ESIEE\GameBundle\Entity\UnitType $unitType
     * @return UnitSpeed
     */
    public function setUnitType(\ESIEE\GameBundle\Entity\UnitType $unitType)
    {
        $this->unitType = $unitType;

        return $this;
    }

    /**
     * Get unitType
     *
     * @return \ESIEE\GameBundle\Entity\UnitType 
     */
    public function getUnitType()
    {
        return $this->unitType;
    }

    /**
     * Set ground
     *
     * @param \ESIEE\GameBundle\Entity\Ground $ground
     * @return UnitSpeed
     */
    public function setGround(\ESIEE\GameBundle\Entity\Ground $ground)
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
