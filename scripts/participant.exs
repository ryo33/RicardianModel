defmodule RicardianModel.Participant do
  alias RicardianModel.Actions

  def fetch_contents(data, id) do
    data
    |> Actions.update_participant_contents(id)
  end

  def update_proposal(data, id, payload) do
    data
    |> Actions.update_proposal(id, payload)
  end

  def propose(data, id, g1, g2) do
    group_id = get_in(data, [:participants, id, :group])
    data
    |> update_in([:groups, group_id], fn group ->
      case group.state do
        "u1thinking" ->
          %{ group |
            state: "u1proposed",
            g1proposal: g1,
            g2proposal: g2,
          }
        "u2thinking" ->
          %{ group |
            state: "u2proposed",
            g1proposal: g1,
            g2proposal: g2,
          }
      end
    end)
    |> Actions.proposed(id, group_id)
  end

  # Utilities

  def format_group(data, group, id) do
    %{participants: participants} = data
    %{
      role: (if group.u1 == id, do: "u1", else: "u2"),
      g1proposal: group.g1proposal,
      g2proposal: group.g2proposal,
      round: group.round,
      state: group.state,
      selling: group.selling,
      pair: Map.get(participants, (if group.u1 == id, do: group.u2, else: id))
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
