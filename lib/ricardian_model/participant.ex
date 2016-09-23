defmodule RicardianModel.Participant do
  alias RicardianModel.Actions

  def fetch_contents(data, id) do
    data
    |> Actions.update_participant_contents(id)
  end

  def fetch_ranking(data, id) do
    data
    |> Actions.update_ranking(id)
  end

  def update_proposal(data, id, payload) do
    data
    |> Actions.update_proposal(id, payload)
  end

  def propose(data, id, goods, g1, g2) do
    group_id = get_in(data, [:participants, id, :group])
    data
    |> update_in([:groups, group_id], fn group ->
      case group.state do
        "u1thinking" ->
          %{ group |
            state: "u1proposed",
            selling: goods,
            g1proposal: g1,
            g2proposal: g2,
          }
        "u2thinking" ->
          %{ group |
            state: "u2proposed",
            selling: goods,
            g1proposal: g1,
            g2proposal: g2,
          }
      end
    end)
    |> Actions.proposed(id, group_id)
  end

  def accept(data, id) do
    group_id = get_group_id(data, id)
    %{
      g1proposal: g1proposal,
      g2proposal: g2proposal,
    } = group = get_group(data, group_id)


    # Only accepts the cases matches the situation
    case get_group(data, group_id) do
      %{u1: ^id, state: "u2proposed"} -> nil
      %{u2: ^id, state: "u1proposed"} -> nil
    end

    updater = fn participant, state ->
      gain = (if group.state == state, do: 1, else: -1)
             * (if group.selling == 1, do: 1, else: -1)
             * (g2proposal * participant.g2rate - g1proposal * participant.g1rate)
      %{ participant | money: participant.money + gain }
    end

    data
    |> update_in([:participants, group.u1], &updater.(&1, "u1proposed"))
    |> update_in([:participants, group.u2], &updater.(&1, "u2proposed"))
    |> update_in([:groups, group_id], fn group ->
      case group.state do
        "u1proposed" ->
          %{ group |
            state: "u2thinking"
          }
        "u2proposed" ->
          finished = group.round + 1 == data.rounds
          %{ group |
            round: group.round + 1,
            state: (if finished, do: "finished", else: "u1thinking")
          }
      end
      |> Map.put(:g1proposal, 0)
      |> Map.put(:g2proposal, 0)
      |> Map.update!(:selling, fn selling ->
        case selling do
          1 -> 2
          2 -> 1
        end
      end)
    end)
    |> Actions.accept(group_id)
  end

  def reject(data, id) do
    group_id = get_group_id(data, id)

    # Only accepts the cases matches the situation
    case get_group(data, group_id) do
      %{u1: ^id, state: "u2proposed"} -> nil
      %{u2: ^id, state: "u1proposed"} -> nil
    end

    data
    |> update_in([:groups, group_id], fn group ->
      case group.state do
        "u1proposed" ->
          %{ group |
            state: "u1thinking"
          }
        "u2proposed" ->
          %{ group |
            state: "u2thinking"
          }
      end
    end)
    |> Actions.reject(group_id)
  end

  def change_goods(data, id, new) do
    group_id = get_group_id(data, id)
    data
    |> update_in([:groups, group_id], fn group ->
      %{ group |
        selling: new
      }
    end)
    |> Actions.change_goods(id, group_id)
  end

  # Utilities
  def get_participant(data, id) do
    get_in(data, [:participants, id])
  end

  def get_group(data, id) do
    get_in(data, [:groups, id])
  end

  def get_group_id(data, id) do
    get_in(data, [:participants, id, :group])
  end

  def get_group_from_participant(data, id) do
    group_id = get_group_id(data, id)
    get_group(data, group_id)
  end

  def format_group(data, group, id) do
    %{participants: participants} = data
    %{
      role: (if group.u1 == id, do: "u1", else: "u2"),
      g1proposal: group.g1proposal,
      g2proposal: group.g2proposal,
      round: group.round,
      state: group.state,
      selling: group.selling,
      pair: Map.get(participants, (if group.u1 == id, do: group.u2, else: group.u1))
    }
  end

  def format_participant(participant), do: participant

  def format_data(data) do
    %{
      page: data.page,
    }
  end

  def format_contents(data, id) do
    p = get_in(data, [:participants, id])
    if is_nil(p.group) do
      format_data(data)
      |> Map.merge(format_participant(p))
    else
      format_data(data)
      |> Map.merge(format_participant(p))
      |> Map.merge(format_group(data, get_in(data, [:groups, p.group]), id))
    end
  end
end
