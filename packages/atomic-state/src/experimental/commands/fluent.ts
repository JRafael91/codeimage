import {Observable} from 'rxjs';
import {Store, StoreValue} from 'statesolid';
import {
  CommandIdentity,
  CommandPayload,
  ExecuteCommandCallback,
  GenericStateCommand,
  makeCommandNotifier,
  MapCommandToActions,
} from 'statesolid/commands';

type GenericCommandsMap = Record<PropertyKey, GenericStateCommand>;

interface StoreWithCommands<
  T,
  Commands extends Record<
    PropertyKey,
    GenericStateCommand
  > = GenericCommandsMap,
> {
  on<
    Command extends GenericStateCommand,
    TCommandName extends CommandIdentity<Command>,
  >(
    command: Command,
    executeFn: ExecuteCommandCallback<T, Command>,
  ): this & StoreWithCommands<T, Commands & {[key in TCommandName]: Command}>;

  dispatch<Command extends GenericStateCommand>(
    command: Command,
    payload: CommandPayload<Command>,
  ): void;

  readonly commands: Commands;
  readonly actions: MapCommandToActions<Commands>;

  watchCommand<Commands extends GenericStateCommand[]>(
    commands?: Commands,
  ): Observable<Commands[number]>;
}

function plugin<T extends StoreValue>(ctx: Store<T>): StoreWithCommands<T> {
  const {
    callbacks: commandsCallbackMap,
    dispatch,
    watchCommand,
  } = makeCommandNotifier(ctx);

  const commands: Record<string, GenericStateCommand> = {};
  const actions: MapCommandToActions<GenericCommandsMap> = {};

  return {
    commands,
    actions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on<
      Command extends GenericStateCommand,
      TCommandName extends CommandIdentity<Command>,
    >(
      command: Command,
      executeFn: ExecuteCommandCallback<T, Command>,
    ): StoreWithCommands<
      T,
      GenericCommandsMap & {[key in TCommandName]: Command}
    > {
      const callbacks = commandsCallbackMap.get(command.identity) ?? [];
      commands[command.identity] = command;
      commandsCallbackMap.set(command.identity, callbacks.concat(executeFn));
      actions[command.identity] = payload => {
        this.dispatch(command, payload);
      };

      return Object.assign(ctx, this) as Store<T> &
        StoreWithCommands<
          T,
          GenericCommandsMap & {[key in TCommandName]: Command}
        >;
    },
    dispatch,
    watchCommand,
  };
}

export const withFluentCommands =
  () =>
  <S extends StoreValue>(ctx: Store<S>) =>
    plugin(ctx);