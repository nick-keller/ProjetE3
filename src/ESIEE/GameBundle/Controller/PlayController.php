<?php

namespace ESIEE\GameBundle\Controller;

use Doctrine\ORM\EntityManager;
use ESIEE\GameBundle\Entity\Game;
use ESIEE\GameBundle\Entity\JsMsg;
use ESIEE\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

    public function sendAction(Game $game, Request $request)
    {
        $for = null;
        $this->getUser()->getId();
        $game->getCreator()->getId();
        if($this->getUser()->getId() == $game->getCreator()->getId())
            $for = $game->getOpponent();
        else
            $for = $game->getCreator();

        $msg = new JsMsg($for, $game, $request->query->get('msg'));

        $this->em->persist($msg);
        $this->em->flush();

        return new Response('ok');
    }

    public function receiveAction(Game $game)
    {
        $repo = $this->em->getRepository('ESIEEGameBundle:JsMsg');
        $msg = $repo->findMsg($game, $this->getUser());
        $repo->removeMsg($msg);


        return new Response(json_encode($msg));
    }
}
