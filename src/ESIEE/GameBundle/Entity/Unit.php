<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Unit
 *
 * @ORM\Table(name="esiee_game_unit")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\UnitRepository")
 */
class Unit
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
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="long_description", type="text")
     */
    private $longDescription;

    /**
     * @var integer
     *
     * @ORM\Column(name="movement", type="integer")
     */
    private $movement;

    /**
     * @var integer
     *
     * @ORM\Column(name="attack_range", type="integer")
     */
    private $range;

    /**
     * @var integer
     *
     * @ORM\Column(name="power", type="integer")
     */
    private $power;

    /**
     * @var integer
     *
     * @ORM\Column(name="defence", type="integer")
     */
    private $defence;

    /**
     * @var integer
     *
     * @ORM\Column(name="assassin", type="boolean")
     */
    private $assassin;

    /**
     * @var integer
     *
     * @ORM\Column(name="attack_first", type="boolean")
     */
    private $attackFirst;

    /**
     * @var integer
     *
     * @ORM\Column(name="fast", type="boolean")
     */
    private $fast;

    /**
     * @var UnitType
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\UnitType", inversedBy="units", cascade={"persist"})
     * @ORM\JoinColumn(name="unit_type_id", referencedColumnName="id")
     */
    private $unitType;

    /**
     * @var integer
     *
     * @ORM\Column(name="coord_x", type="integer")
     */
    private $coordX;

    /**
     * @var integer
     *
     * @ORM\Column(name="coord_y", type="integer")
     */
    private $coordY;


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
     * @return Unit
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
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $longDescription
     */
    public function setLongDescription($longDescription)
    {
        $this->longDescription = $longDescription;
    }

    /**
     * @return string
     */
    public function getLongDescription()
    {
        return $this->longDescription;
    }

    /**
     * Set movement
     *
     * @param integer $movement
     * @return Unit
     */
    public function setMovement($movement)
    {
        $this->movement = $movement;

        return $this;
    }

    /**
     * Get movement
     *
     * @return integer 
     */
    public function getMovement()
    {
        return $this->movement;
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
     * @param int $assassin
     */
    public function setAssassin($assassin)
    {
        $this->assassin = $assassin;
    }

    /**
     * @return int
     */
    public function getAssassin()
    {
        return $this->assassin;
    }

    /**
     * @param int $attackFirst
     */
    public function setAttackFirst($attackFirst)
    {
        $this->attackFirst = $attackFirst;
    }

    /**
     * @return int
     */
    public function getAttackFirst()
    {
        return $this->attackFirst;
    }

    /**
     * @param int $defence
     */
    public function setDefence($defence)
    {
        $this->defence = $defence;
    }

    /**
     * @return int
     */
    public function getDefence()
    {
        return $this->defence;
    }

    /**
     * @param int $fast
     */
    public function setFast($fast)
    {
        $this->fast = $fast;
    }

    /**
     * @return int
     */
    public function getFast()
    {
        return $this->fast;
    }

    /**
     * @param int $power
     */
    public function setPower($power)
    {
        $this->power = $power;
    }

    /**
     * @return int
     */
    public function getPower()
    {
        return $this->power;
    }

    /**
     * @param int $range
     */
    public function setRange($range)
    {
        $this->range = $range;
    }

    /**
     * @return int
     */
    public function getRange()
    {
        return $this->range;
    }

    /**
     * Set coordX
     *
     * @param integer $coordX
     * @return Tile
     */
    public function setCoordX($coordX)
    {
        if(preg_match('#^[0-9]+-[0-9]+$#', $coordX)){
            $data = explode('-', $coordX);
            $this->coordX = $data[0];
            $this->coordY = $data[1];
        }

        $this->coordX = $coordX;

        return $this;
    }

    /**
     * Get coordX
     *
     * @return integer
     */
    public function getCoordX()
    {
        return $this->coordX;
    }

    /**
     * Set coordY
     *
     * @param integer $coordY
     * @return Tile
     */
    public function setCoordY($coordY)
    {
        $this->coordY = $coordY;

        return $this;
    }

    /**
     * Get coordY
     *
     * @return integer
     */
    public function getCoordY()
    {
        return $this->coordY;
    }

}
