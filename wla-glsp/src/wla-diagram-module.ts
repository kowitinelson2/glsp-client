import {   
    bindAsService,
    bindOrRebind,
    CollapseExpandAction,
    configureActionHandler,
    configureDefaultModelElements,
    configureModelElement,
    ConsoleLogger,
    ContainerConfiguration,
    debugModule,    
    DeleteElementContextMenuItemProvider,        
    FeatureModule,
    GEdge,
    GGraph,
    GGraphView,
    GLabel,
    GLabelView,
    GNode,
    GPort,
    gridModule,
    helperLineModule,
    initializeDiagramContainer,
    LogLevel,
    moveFeature,
    RevealNamedElementActionProvider,
    selectFeature,
    TYPES,
} from '@eclipse-glsp/client';
import { Container} from 'inversify';
import '../css/diagram.css';
import 'sprotty/css/sprotty.css';
import { BoxView, ClusterView, JobNodeView, ParentNodeView, SimpleView, SubGraphView } from './views/nodeviews';
import { DependencyView } from './views/edgeviews';
import { PortViewWithLabel } from './views/portviews';
import { CustomLabelView } from './views/labelviews';
import { ClusterNode } from './model';
import { ExpandHandler } from './action/collapse-expand';

const wlaDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bindOrRebind(context, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    bindOrRebind(context, TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bindAsService(context, TYPES.ICommandPaletteActionProvider, RevealNamedElementActionProvider);
    bindAsService(context, TYPES.IContextMenuItemProvider, DeleteElementContextMenuItemProvider);
    bind(ExpandHandler).toSelf().inSingletonScope();

    configureActionHandler(context, CollapseExpandAction.KIND, ExpandHandler);

    configureDefaultModelElements(context);
    configureModelElement(context, 'graph:customgraph', GGraph, GGraphView);
    configureModelElement(context, 'node:rootnode', GNode, ParentNodeView)
    configureModelElement(context, 'node:job', GNode, JobNodeView)
    configureModelElement(context, 'node:cluster', ClusterNode, ClusterView)
    configureModelElement(context, 'node:subgraph', GNode, SubGraphView)
    configureModelElement(context, 'node:box', GNode, BoxView)
    configureModelElement(context, 'node:simple', GNode, SimpleView)
    configureModelElement(context, 'port:simplein', GPort, PortViewWithLabel, {
        disable : [moveFeature, selectFeature]
    })
    configureModelElement(context, 'port:simpleout', GPort, PortViewWithLabel, {
        disable : [moveFeature, selectFeature]
    })
    configureModelElement(context, 'port:clusterin', GPort, PortViewWithLabel, {
        disable : [moveFeature, selectFeature]
    })
    configureModelElement(context, 'port:clusterout', GPort, PortViewWithLabel, {
        disable : [moveFeature, selectFeature]
    })
    configureModelElement(context, 'edge:arrow', GEdge, DependencyView)
    configureModelElement(context, 'edge:noarrow', GEdge, DependencyView)
    configureModelElement(context, 'label:portlabel', GLabel, GLabelView)
    configureModelElement(context, 'label:nodelabel', GLabel, CustomLabelView)
}, 
{ featureId: Symbol('wla-diagram') }
);

export function createWLADiagramContainer(...containerConfiguration: ContainerConfiguration): Container {
    return initializeWLADiagramContainer(new Container(), ...containerConfiguration);
}

export function initializeWLADiagramContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
    return initializeDiagramContainer(container, 
        helperLineModule,
        gridModule,
        debugModule,
        wlaDiagramModule, 
        ...containerConfiguration);
}
