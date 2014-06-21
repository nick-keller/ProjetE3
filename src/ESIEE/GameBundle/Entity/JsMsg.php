<?php

namespace ESIEE\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use ESIEE\UserBundle\Entity\User;

/**
 * JsMsg
 *
 * @ORM\Table(name="esiee_game_jsmsg")
 * @ORM\Entity(repositoryClass="ESIEE\GameBundle\Repository\JsMsgRepository")
 */
class JsMsg
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
     * @ORM\Column(name="message", type="text")
     */
    private $message;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\UserBundle\Entity\User")
     */
    private $for;

    /**
     * @var Game
     *
     * @ORM\ManyToOne(targetEntity="ESIEE\GameBundle\Entity\Game")
     */
    private $game;

    function __construct(User $for, Game $game, $message)
    {
        $this->for = $for;
        $this->game = $game;
        $this->message = $message;
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
     * Set message
     *
     * @param string $message
     * @return JsMsg
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return string 
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set for
     *
     * @param \ESIEE\UserBundle\Entity\User $for
     * @return JsMsg
     */
    public function setFor(\ESIEE\UserBundle\Entity\User $for = null)
    {
        $this->for = $for;

        return $this;
    }

    /**
     * Get for
     *
     * @return \ESIEE\UserBundle\Entity\User 
     */
    public function getFor()
    {
        return $this->for;
    }

    /**
     * Set game
     *
     * @param \ESIEE\GameBundle\Entity\Game $game
     * @return JsMsg
     */
    public function setGame(\ESIEE\GameBundle\Entity\Game $game = null)
    {
        $this->game = $game;

        return $this;
    }

    /**
     * Get game
     *
     * @return \ESIEE\GameBundle\Entity\Game 
     */
    public function getGame()
    {
        return $this->game;
    }
}
