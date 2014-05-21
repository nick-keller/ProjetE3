<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tile
 *
 * @ORM\Table(name="esiee_game_tile")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\TileRepository")
 */
class Tile
{

    const TOP_LEFT = 0;
    const TOP = 1;
    const TOP_RIGHT = 2;
    const LEFT = 3;
    const CENTER = 4;
    const RIGHT = 5;
    const BOTTOM_LEFT = 6;
    const BOTTOM = 7;
    const BOTTOM_RIGHT = 8;
    const INNER_TOP_LEFT = 9;
    const INNER_TOP_RIGHT = 10;
    const INNER_BOTTOM_LEFT = 11;
    const INNER_BOTTOM_RIGHT = 12;

    const RANDOM = 0;
    const CHECKER_TOP_LEFT = 1;
    const CHECKER_TOP_RIGHT = 2;
    const CHECKER_BOTTOM_LEFT = 3;
    const CHECKER_BOTTOM_RIGHT = 4;


    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

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
     * @var integer
     *
     * @ORM\Column(name="type", type="integer")
     */
    private $type;

    /**
     * @var integer
     *
     * @ORM\Column(name="distribution", type="integer")
     */
    private $distribution;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\TileFamily", inversedBy="tiles")
     * @ORM\JoinColumn(name="tile_family_id", referencedColumnName="id")
     */
    private $tileFamily;


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

    /**
     * Set type
     *
     * @param integer $type
     * @return Tile
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return integer 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set tileFamily
     *
     * @param \ESIEE\GameBundle\Entity\TileFamily $tileFamily
     * @return Tile
     */
    public function setTileFamily(\ESIEE\GameBundle\Entity\TileFamily $tileFamily = null)
    {
        $this->tileFamily = $tileFamily;

        return $this;
    }

    /**
     * Get tileFamily
     *
     * @return \ESIEE\GameBundle\Entity\TileFamily 
     */
    public function getTileFamily()
    {
        return $this->tileFamily;
    }

    /**
     * @param int $distribution
     */
    public function setDistribution($distribution)
    {
        $this->distribution = $distribution;
    }

    /**
     * @return int
     */
    public function getDistribution()
    {
        return $this->distribution;
    }
}
