<?php

namespace ESIEE\GameBundle\Admin;


use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class UnitAdmin extends Admin
{
    protected function configureShowFields(ShowMapper $filter)
    {
        $filter
            ->add('id')
            ->add('name')
            ->add('description')
            ->add('longDescription')
            ->add('unitType')
            ->add('movement')
            ->add('range')
            ->add('power')
            ->add('defence')
            ->add('assassin')
            ->add('attackFirst')
            ->add('fast')
        ;
    }

    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
        ->with('Général')
            ->add('name', 'text', array(
                'label' => 'Nom'
            ))
            ->add('unitType', null, array(
                'label' => 'Type d\'unité',
                'empty_value' => false,
            ))
        ->end()
        ->with('Description')
            ->add('description', null, array(
                'label' => 'Description courte',
            ))
            ->add('longDescription', null, array(
                'label' => 'Description longue',
            ))
        ->end()
        ->with('Combat')
            ->add('movement', null, array(
                'label' => 'Déplacement par tour'
            ))
            ->add('range', null, array(
                'label' => 'Portée'
            ))
            ->add('power', null, array(
                'label' => 'Puissance'
            ))
            ->add('defence', null, array(
                'label' => 'Défence'
            ))
            ->add('assassin', null, array(
                'label' => 'Assassin',
                'required' => false,
            ))
            ->add('attackFirst', null, array(
                'label' => 'Ataque en premier',
                'required' => false,
            ))
            ->add('fast', null, array(
                'label' => 'Unité rapide',
                'required' => false,
            ))
        ->end()
        ;
    }

    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name')
            ->add('unitType')
            ->add('assassin')
            ->add('attackFirst')
            ->add('fast')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('id')
            ->addIdentifier('name')
            ->add('unitType')
            ->add('movement', null, array(
                'editable' => true,
            ))
            ->add('range', null, array(
                'editable' => true,
            ))
            ->add('power', null, array(
                'editable' => true,
            ))
            ->add('defence', null, array(
                'editable' => true,
            ))
            ->add('assassin', null, array(
                'editable' => true,
            ))
            ->add('attackFirst', null, array(
                'editable' => true,
            ))
            ->add('fast', null, array(
                'editable' => true,
            ))
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