export interface Engine<TInput, TOutput> {
    execute(input: TInput): Promise<TOutput> | TOutput;
}
