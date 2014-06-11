<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Building
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\BuildingRepository")
 */
class Building
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
     * @ORM\Column(name="name", type="string", length=40)
     */
    private $name;

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
     * @return Building
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
     * Set coordX
     *
     * @param integer $coordX
     * @return Building
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
     * @return Building
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
