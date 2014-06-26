<?php

namespace ESIEE\EditorBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use ESIEE\UserBundle\Entity\User;

/**
 * Level
 *
 * @ORM\Table(name="esiee_editor_level")
 * @ORM\Entity(repositoryClass="ESIEE\EditorBundle\Entity\LevelRepository")
 */
class Level
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
     * @ORM\Column(name="size", type="string", length=255)
     */
    private $size;

    /**
     * @var string
     *
     * @ORM\Column(name="tiles", type="text")
     */
    private $tiles;

    /**
     * @var string
     *
     * @ORM\Column(name="buildings", type="text")
     */
    private $buildings;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\UserBundle\Entity\User")
     */
    private $creator;


    function __construct(User $creator)
    {
        $this->creator = $creator;
        $this->name = 'Mon niveau';
        $this->size = '20,12';

        $emptyTab = json_encode(array_fill(0, 20, array_fill(0, 12, 0)));
        $this->tiles = $emptyTab;
        $this->buildings = $emptyTab;
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
     * @return Level
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
     * Set size
     *
     * @param string $size
     * @return Level
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * Get size
     *
     * @return string 
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set tiles
     *
     * @param string $tiles
     * @return Level
     */
    public function setTiles($tiles)
    {
        $this->tiles = $tiles;

        return $this;
    }

    /**
     * Get tiles
     *
     * @return string 
     */
    public function getTiles()
    {
        return $this->tiles;
    }

    /**
     * Set buildings
     *
     * @param string $buildings
     * @return Level
     */
    public function setBuildings($buildings)
    {
        $this->buildings = $buildings;

        return $this;
    }

    /**
     * Get buildings
     *
     * @return string 
     */
    public function getBuildings()
    {
        return $this->buildings;
    }

    /**
     * Set creator
     *
     * @param \ESIEE\UserBundle\Entity\User $creator
     * @return Game
     */
    public function setCreator(\ESIEE\UserBundle\Entity\User $creator = null)
    {
        $this->creator = $creator;

        return $this;
    }

    /**
     * Get creator
     *
     * @return \ESIEE\UserBundle\Entity\User
     */
    public function getCreator()
    {
        return $this->creator;
    }
}
