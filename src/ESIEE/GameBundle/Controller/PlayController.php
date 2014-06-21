<?php

namespace ESIEE\GameBundle\Controller;

use Doctrine\ORM\EntityManager;
use ESIEE\GameBundle\Entity\Game;
use ESIEE\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class PlayController extends Controller
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @Template
     */
    public function indexAction()
    {
        return array(
            'users' => $this->em->getRepository('ESIEEUserBundle:user')->findAll()
        );
    }

    /**
     * @Template
     */
    public function playAction(Game $game)
    {
        return array(
            'game' => $game
        );
    }

    /**
     * @Template
     */
    public function newAction(User $opponent)
    {
        $game = new Game($this->getUser(), $opponent);

        $this->em->persist($game);
        $this->em->flush();

        return $this->redirect($this->generateUrl('esiee_game_play', array('id' => $game->getId())));
    }
}
