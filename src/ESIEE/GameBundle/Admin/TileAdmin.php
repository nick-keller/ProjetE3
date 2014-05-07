<?php

namespace ESIEE\GameBundle\Admin;


use ESIEE\GameBundle\Entity\Tile;
use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class TileAdmin extends Admin
{
    protected function configureShowFields(ShowMapper $filter)
    {
        $filter
            ->add('id')
            ->add('tileFamily')
            ->add('type')
            ->add('coordX')
            ->add('coordY')
        ;
    }

    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('tileFamily', null, array(
                'label' => 'Famille de tuile'
            ))
            ->add('type', 'choice', array(
                'label' => 'Type',
                'choices' => array(
                    Tile::TOP_LEFT => 'Coins haut gauche',
                    Tile::TOP_RIGHT => 'Coins haut droit',
                    Tile::BOTTOM_LEFT => 'Coins bas gauche',
                    Tile::BOTTOM_RIGHT => 'Coins bas droit',
                    Tile::TOP => 'Bord haut',
                    Tile::RIGHT => 'Bord droit',
                    Tile::BOTTOM => 'Bord bas',
                    Tile::LEFT => 'Bord gauche',
                    Tile::CENTER => 'Centre',
                    Tile::INNER_TOP_LEFT => 'Coins intérieur haut gauche',
                    Tile::INNER_TOP_RIGHT => 'Coins intérieur haut droit',
                    Tile::INNER_BOTTOM_LEFT => 'Coins intérieur bas gauche',
                    Tile::INNER_BOTTOM_RIGHT => 'Coins intérieur bas droit',
                )
            ))
            ->add('coordX', null, array(
                'label' => 'Coordonée X'
            ))
            ->add('coordY', null, array(
                'label' => 'Coordonée Y'
            ))
        ;
    }

    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('tileFamily')
            ->add('type')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('tileFamily')
            ->add('corrdX')
            ->add('corrdY')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array(),
                )
            ))
        ;
    }
}