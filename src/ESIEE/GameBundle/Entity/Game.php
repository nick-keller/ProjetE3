<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use ESIEE\EditorBundle\Entity\Level;
use ESIEE\UserBundle\Entity\User;

/**
 * Game
 *
 * @ORM\Table(name="esiee_game_game")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\GameRepository")
 */
class Game
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
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\UserBundle\Entity\User")
     */
    private $creator;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\UserBundle\Entity\User")
     */
    private $opponent;

    /**
     * @var Level
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\EditorBundle\Entity\Level")
     */
    private $level;

    public function __construct(User $creator = null, User $opponent = null)
    {
        $this->creator = $creator;
        $this->opponent = $opponent;
        $this->level = null;
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

    /**
     * Set opponent
     *
     * @param \ESIEE\UserBundle\Entity\User $opponent
     * @return Game
     */
    public function setOpponent(\ESIEE\UserBundle\Entity\User $opponent = null)
    {
        $this->opponent = $opponent;

        return $this;
    }

    /**
     * Get opponent
     *
     * @return \ESIEE\UserBundle\Entity\User 
     */
    public function getOpponent()
    {
        return $this->opponent;
    }

    /**
     * @param \ESIEE\EditorBundle\Entity\Level $level
     */
    public function setLevel($level)
    {
        $this->level = $level;
    }

    /**
     * @return \ESIEE\EditorBundle\Entity\Level
     */
    public function getLevel()
    {
        return $this->level;
    }
}
